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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Prorder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Integer qty;

    private LocalDate dostart;

    private LocalDate deadline;

    private LocalDate doend;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customorderitem customorderitem;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Prorderstatus prorderstatus;

    @OneToMany(mappedBy="prorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prordermaterial> prordermaterialList;

    @OneToMany(mappedBy="prorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prorderemployee> prorderemployeeList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "prorder")
    private List<Prmaterialreturn> prorderPrmaterialreturnList;


    public Prorder(Integer id){
        this.id = id;
    }

    public Prorder(Integer id, String code, Customorderitem customorderitem, Product product, Integer qty, LocalDate dostart, Prorderstatus prorderstatus){
        this.id = id;
        this.code = code;
        this.customorderitem = customorderitem;
        this.product = product;
        this.qty = qty;
        this.dostart = dostart;
        this.prorderstatus = prorderstatus;
    }

}