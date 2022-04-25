package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Supplierreturn{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate doreturned;

    private LocalDate dorecived;

    @Lob
    private String reason;

    private LocalDateTime tocreation;


    @ManyToOne
    private Purchase purchase;

    @ManyToOne
    private Supplierreturnstatus supplierreturnstatus;

    @OneToMany(mappedBy="supplierreturn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supplierreturnmaterial> supplierreturnmaterialList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Supplierreturn(Integer id){
        this.id = id;
    }

    public Supplierreturn(Integer id, String code, Purchase purchase){
        this.id = id;
        this.code = code;
        this.purchase = purchase;
    }

}