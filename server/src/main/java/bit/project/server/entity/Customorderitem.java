package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customorderitem{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal qty;

    private BigDecimal unitprice;

    private String name;

    private String document;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customerorder customerorder;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "customorderitem")
    private List<Prorder> customorderitemProrderList;


    public Customorderitem(Integer id){
        this.id = id;
    }

    public Customorderitem(Integer id, String code, Customerorder customerorder){
        this.id = id;
        this.code = code;
        this.customerorder = customerorder;
    }

}